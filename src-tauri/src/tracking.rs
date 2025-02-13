
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    thread,
    time::{Duration, Instant},
};

#[cfg(target_os = "windows")]
use winapi::{
    shared::minwindef::DWORD,
    um::{
        winuser::{GetForegroundWindow, GetWindowThreadProcessId},
        psapi::{GetModuleFileNameExW, GetModuleBaseNameW},
        processthreadsapi::OpenProcess,
        winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ},
    },
    shared::winerror::ERROR_SUCCESS,
};

#[derive(serde::Serialize, Clone, Debug)]
pub struct AppUsage {
    pub name: String,
    pub description: String,
    pub usage_seconds: u64,
}

fn get_app_name_from_process(process_name: &str) -> (String, String) {
    println!("Raw process name: {}", process_name); //TODO: Remove Debug LOg    
    
    match process_name.to_lowercase().as_str() {
        "chrome.exe" => ("Chrome".to_string(), "Web Browser".to_string()),
        "code.exe" | "Code.exe" => ("VS Code".to_string(), "Code Editor".to_string()),
        "slack.exe" => ("Slack".to_string(), "Communication".to_string()),
        "spotify.exe" => ("Spotify".to_string(), "Music Player".to_string()),
        "windowsterminal.exe" | "cmd.exe" => ("Terminal".to_string(), "Command Line".to_string()),
        "explorer.exe" => ("File Explorer".to_string(), "File Management".to_string()),
        "msedge.exe" => ("Edge".to_string(), "Web Browser".to_string()),
        "firefox.exe" => ("Firefox".to_string(), "Web Browser".to_string()),
        "notepad.exe" => ("Notepad".to_string(), "Text Editor".to_string()),
        "devenv.exe" => ("Visual Studio".to_string(), "IDE".to_string()),
        "idea64.exe" => ("IntelliJ IDEA".to_string(), "IDE".to_string()),
        "pycharm64.exe" => ("PyCharm".to_string(), "IDE".to_string()),
        "discord.exe" => ("Discord".to_string(), "Communication".to_string()),
        "teams.exe" => ("Microsoft Teams".to_string(), "Communication".to_string()),
        _ => (process_name.to_string(), "Application".to_string()),
    }
}

#[cfg(target_os = "windows")]
fn get_active_app_info() -> Option<(String, String)> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.is_null() {
            return None;
        }

        let mut process_id: DWORD = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id);
        
        if process_id == 0 {
            return None;
        }
        
        // Request both PROCESS_QUERY_INFORMATION and PROCESS_VM_READ access rights
        let handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, process_id);
        if handle.is_null() {
            println!("Failed to open process with ID: {}", process_id);
            return None;
        }

        let mut buffer: [u16; 260] = [0; 260];
        let len = GetModuleBaseNameW(handle, std::ptr::null_mut(), buffer.as_mut_ptr(), 260) as usize;
        
        // Close the handle regardless of success
        winapi::um::handleapi::CloseHandle(handle);
        
        if len == 0 {
            let handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, process_id);
            if !handle.is_null() {
                let len = GetModuleFileNameExW(handle, std::ptr::null_mut(), buffer.as_mut_ptr(), 260) as usize;
                winapi::um::handleapi::CloseHandle(handle);
                
                if len > 0 {
                    let full_path = String::from_utf16_lossy(&buffer[..len]);
                    if let Some(file_name) = full_path.split('\\').last() {
                        return Some(get_app_name_from_process(file_name));
                    }
                }
            }
            return None;
        }

        let process_name = String::from_utf16_lossy(&buffer[..len]);
        Some(get_app_name_from_process(&process_name))
    }
}

pub fn start_tracking_thread(tracking: Arc<Mutex<HashMap<String, AppUsage>>>) {
    println!("Starting tracking thread");
    
    thread::spawn(move || {
        let mut current_app = String::new();
        let mut last_update = Instant::now();

        loop {
            thread::sleep(Duration::from_secs(1));

            if let Some((app_name, description)) = get_active_app_info() {
                if app_name != current_app {
                    let elapsed = last_update.elapsed().as_secs();
                    
                    if !current_app.is_empty() && elapsed > 0 {
                        if let Ok(mut tracking) = tracking.lock() {
                            if let Some(usage) = tracking.get_mut(&current_app) {
                                usage.usage_seconds += elapsed;
                                println!("Updated {}: {} seconds", current_app, usage.usage_seconds);
                            }
                        }
                    }
                    
                    if let Ok(mut tracking) = tracking.lock() {
                        tracking.entry(app_name.clone())
                            .or_insert(AppUsage {
                                name: app_name.clone(),
                                description: description.clone(),
                                usage_seconds: 0,
                            });
                        println!("Now tracking: {}", app_name);
                    }
                    
                    current_app = app_name;
                    last_update = Instant::now();
                } else {
                    if let Ok(mut tracking) = tracking.lock() {
                        if let Some(usage) = tracking.get_mut(&current_app) {
                            usage.usage_seconds += 1;
                        }
                    }
                }
            }
        }
    });
}