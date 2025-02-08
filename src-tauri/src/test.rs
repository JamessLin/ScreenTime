use std::{
    collections::HashMap,
    thread,
    time::{Duration, Instant},
};

#[cfg(target_os = "windows")]
use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};

#[cfg(target_os = "windows")]
fn get_active_window_title() -> Option<String> {

    let hwnd = unsafe { GetForegroundWindow() };
    if hwnd.is_null() {
        return None;
    }
    
    let mut buffer: [u16; 512] = [0; 512];
    let len = unsafe { GetWindowTextW(hwnd, buffer.as_mut_ptr(), buffer.len() as i32) };
    
    if len == 0 {
        return None;
    }

    Some(String::from_utf16_lossy(&buffer[..len as usize]))
}

#[cfg(not(target_os = "windows"))]
fn get_active_window_title() -> Option<String> {
    unimplemented!("Active window detection is not implemented for this OS")
}

fn main() {
    let mut tracking: HashMap<String, u64> = HashMap::new();

    let mut current_window = String::new();
    let mut last_update = Instant::now();

    loop {
        thread::sleep(Duration::from_secs(1));

        if let Some(window_title) = get_active_window_title() {
            if window_title != current_window {
                let elapsed = last_update.elapsed().as_secs();
                if !current_window.is_empty() {
                    let counter = tracking.entry(current_window.clone()).or_insert(0);
                    *counter += elapsed;
                    println!("'{}' was active for {} seconds", current_window, elapsed);
                }
                current_window = window_title;
                last_update = Instant::now();
            }
        } else {
            println!("Could not determine the active window.");
        }

     
    }
}
