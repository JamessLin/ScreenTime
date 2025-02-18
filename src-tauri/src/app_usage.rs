use serde::Serialize;
use std::collections::HashMap;
use std::sync::RwLock;
use chrono::{DateTime, Local};
use once_cell::sync::Lazy;
use tokio::time::{sleep, Duration};
use std::time::Instant;

#[cfg(target_os = "windows")]
use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId};

#[cfg(target_os = "windows")]
use std::ptr::null_mut;

#[cfg(target_os = "windows")]
use winapi::um::processthreadsapi::OpenProcess;
#[cfg(target_os = "windows")]
use winapi::um::psapi::GetModuleBaseNameW;
#[cfg(target_os = "windows")]
use winapi::um::handleapi::CloseHandle;
#[cfg(target_os = "windows")]
use winapi::um::winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};

/// Represents the active window information including its process ID,
/// window title, and the associated process (application) name.
struct ActiveWindow {
    id: u32,
    title: String,
    process_name: String,
}

/// Formats a given application name by stripping a trailing ".exe" (if present)
/// and capitalizing the first letter.
///
/// # Arguments
///
/// * `name` - A string slice that holds the name of the process.
///
/// # Returns
///
/// A formatted `String` with the first letter in uppercase.
fn format_name(name: &str) -> String {
    let name = if name.to_lowercase().ends_with(".exe") {
        &name[..name.len() - 4]
    } else {
        name
    };

    let mut chars = name.chars();
    match chars.next() {
        None => String::new(),
        Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
    }
}

#[cfg(target_os = "windows")]
/// Retrieves the process name for a given process ID on Windows.
///
/// This function opens the process with the necessary permissions, retrieves
/// the base module name, formats it using `format_name`, and then returns it.
///
/// # Safety
///
/// This function uses `unsafe` code blocks to interact with Windows APIs.
///
/// # Arguments
///
/// * `process_id` - The process ID for which to retrieve the name.
///
/// # Returns
///
/// An `Option<String>` containing the formatted process name, or `None` if retrieval fails.
fn get_process_name(process_id: u32) -> Option<String> {
    unsafe {
        // Open the process with the rights to query information and read its memory.
        let process_handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, process_id);
        if process_handle.is_null() {
            eprintln!("Failed to open process with id: {}", process_id);
            return None;
        }
        let mut buffer: [u16; 512] = [0; 512];
        let len = GetModuleBaseNameW(process_handle, null_mut(), buffer.as_mut_ptr(), buffer.len() as u32);
        CloseHandle(process_handle);
        if len > 0 {
            let raw_name = String::from_utf16_lossy(&buffer[..len as usize]);
            Some(format_name(&raw_name))
        } else {
            eprintln!("Failed to get process name for process id: {}", process_id);
            None
        }
    }
}

#[cfg(target_os = "windows")]
/// Retrieves the currently active window's information on Windows.
///
/// This function uses Windows APIs to get the foreground window handle,
/// retrieve the window title, and obtain the associated process name.
///
/// # Returns
///
/// An `Option<ActiveWindow>` containing details about the active window, or `None` if detection fails.
fn get_active_window() -> Option<ActiveWindow> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.is_null() {
            eprintln!("GetForegroundWindow returned null.");
            return None;
        }
        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id);
        
        // Retrieve the window title.
        let mut buffer: [u16; 512] = [0; 512];
        let len = GetWindowTextW(hwnd, buffer.as_mut_ptr(), buffer.len() as i32);
        let title = if len > 0 {
            String::from_utf16_lossy(&buffer[..len as usize])
        } else {
            eprintln!(
                "Failed to get window title for process id: {}. Using default title.",
                process_id
            );
            "Unknown".to_string()
        };

        // Dynamically retrieve the process (application) name.
        let process_name = get_process_name(process_id).unwrap_or_else(|| "Unknown".to_string());

        Some(ActiveWindow { id: process_id, title, process_name })
    }
}

#[cfg(not(target_os = "windows"))]
/// Stub function for non-Windows platforms.
///
/// Active window detection is not implemented for this operating system. An error is printed.
///
/// # Returns
///
/// Always returns `None`.
fn get_active_window() -> Option<ActiveWindow> {
    eprintln!("Active window detection is not implemented for this OS. Please contribute support for your platform.");
    None
}

/// Internal structure for tracking usage data per unique window.
///
/// This structure records the number of active seconds, the last time the window
/// was updated, the last used timestamp, and the dynamic process name.
struct UsageData {
    seconds: u64,
    last_instant: Instant,
    last_used: DateTime<Local>,
    process_name: String, // now stores the dynamically retrieved process name
}

/// Represents the usage information of an application to be sent to the frontend.
///
/// Fields include a unique identifier, the application name, formatted active time,
/// total active time in minutes, a placeholder for change percentage, the last used time,
/// and a simple categorization.
#[derive(Debug, Clone, Serialize)]
pub struct AppUsage {
    /// A unique ID generated from the process ID.
    pub id: String,
    /// The application name (e.g. "Google Chrome", "Discord", "Visual Studio Code").
    pub name: String,
    /// Formatted active time as "HH:MM".
    pub time: String,
    /// Total active time in minutes.
    pub time_in_minutes: u64,
    /// Change percentage (reserved for future logic).
    pub change: i64,
    /// Last active time as a formatted string.
    pub last_used: String,
    /// A simple category based on the app name.
    pub category: String,
}

/// Global usage map keyed by the unique identifier (process ID).
static APP_USAGE: Lazy<RwLock<HashMap<u32, UsageData>>> = Lazy::new(|| {
    RwLock::new(HashMap::new())
});

/// Categorizes an application based on its name.
///
/// # Arguments
///
/// * `name` - The name of the application.
///
/// # Returns
///
/// A `String` representing the category, e.g. "Browser", "Productivity", "Music", or "Other".
fn categorize_app(name: &str) -> String {
    let lower = name.to_lowercase();
    if lower.contains("chrome") || lower.contains("firefox") || lower.contains("safari") {
        "Browser".to_string()
    } else if lower.contains("microsoft") || lower.contains("office") {
        "Productivity".to_string()
    } else if lower.contains("spotify") || lower.contains("music") {
        "Music".to_string()
    } else {
        "Other".to_string()
    }
}

/// Formats a given number of seconds into a "HH:MM" string.
///
/// # Arguments
///
/// * `seconds` - The total seconds to format.
///
/// # Returns
///
/// A `String` in the format "HH:MM".
fn format_time(seconds: u64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    format!("{:02}:{:02}", hours, minutes)
}

/// Starts tracking active window usage asynchronously.
///
/// This function spawns an asynchronous task that periodically (every second)
/// checks for changes in the active window. When a change is detected, it updates
/// the usage statistics in the global `APP_USAGE` map and prints the current status.
pub fn start_tracking() {
    tauri::async_runtime::spawn(async {
        let mut current_window: Option<ActiveWindow> = None;
        let mut last_update_instant = Instant::now();

        loop {
            sleep(Duration::from_secs(1)).await;
            let now = Instant::now();

            if let Some(new_window) = get_active_window() {
                match &current_window {
                    Some(curr) => {
                        if curr.id != new_window.id {
                            let elapsed = now.duration_since(last_update_instant).as_secs();
                            {
                                let mut usage_map = APP_USAGE.write().unwrap();
                                usage_map.entry(curr.id)
                                    .and_modify(|data| {
                                        data.seconds += elapsed;
                                        data.last_instant = now;
                                        data.last_used = Local::now();
                                    })
                                    .or_insert(UsageData {
                                        seconds: elapsed,
                                        last_instant: now,
                                        last_used: Local::now(),
                                        process_name: curr.process_name.clone(),
                                    });
                            }
                            println!(
                                "Switched to: '{}' (Window Title: '{}') at {}",
                                new_window.process_name,
                                new_window.title,
                                Local::now().format("%Y-%m-%d %H:%M:%S")
                            );
                            current_window = Some(new_window);
                            last_update_instant = now;
                        } else {
                            let elapsed = now.duration_since(last_update_instant).as_secs();
                            {
                                let mut usage_map = APP_USAGE.write().unwrap();
                                usage_map.entry(new_window.id)
                                    .and_modify(|data| {
                                        data.seconds += elapsed;
                                        data.last_instant = now;
                                        data.last_used = Local::now();
                                    })
                                    .or_insert(UsageData {
                                        seconds: elapsed,
                                        last_instant: now,
                                        last_used: Local::now(),
                                        process_name: new_window.process_name.clone(),
                                    });
                            }
                            last_update_instant = now;
                        }
                    }
                    None => {
                        println!(
                            "Started tracking: '{}' (Window Title: '{}') at {}",
                            new_window.process_name,
                            new_window.title,
                            Local::now().format("%Y-%m-%d %H:%M:%S")
                        );
                        current_window = Some(new_window);
                        last_update_instant = now;
                    }
                }
            } else {
                eprintln!("No active window detected.");
            }
        }
    });
}

/// Tauri command that returns the current usage data for display on the frontend.
///
/// It reads the global usage map, formats each record into an `AppUsage` struct,
/// and returns a vector of these structs.
///
/// # Returns
///
/// A `Vec<AppUsage>` containing the usage information for each tracked application.
#[tauri::command]
pub fn get_app_usage() -> Vec<AppUsage> {
    let usage_map = APP_USAGE.read().unwrap();
    let mut result = Vec::new();

    for (&id, data) in usage_map.iter() {
        let minutes = data.seconds / 60;
        // Use the dynamically retrieved process name instead of parsing the window title.
        let app_name = data.process_name.clone();
        result.push(AppUsage {
            id: format!("{:x}", md5::compute(id.to_le_bytes())),
            name: app_name.clone(),
            time: format_time(data.seconds),
            time_in_minutes: minutes,
            change: 0, // TODO: Future logic for change tracking can be implemented here.
            last_used: data.last_used.format("%Y-%m-%d %H:%M:%S").to_string(),
            category: categorize_app(&app_name),
        });
    }

    result
}
