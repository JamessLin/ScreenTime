// src-tauri/src/tracking.rs
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    thread,
    time::{Duration, Instant},
};

#[cfg(target_os = "windows")]
use winapi::{
    shared::minwindef::DWORD,
    um::winuser::{GetForegroundWindow, GetWindowTextW},
};

pub fn start_tracking_thread(tracking: Arc<Mutex<HashMap<String, u64>>>) {
    thread::spawn(move || {
        let mut current_window = String::new();
        let mut last_update = Instant::now();

        loop {
            thread::sleep(Duration::from_secs(1));

            match get_active_window_title() {
                Some(window_title) => {
                    if window_title != current_window {
                        let elapsed = last_update.elapsed().as_secs();
                        
                        if !current_window.is_empty() && elapsed > 0 {
                            if let Ok(mut tracking) = tracking.lock() {
                                let counter = tracking.entry(current_window.clone()).or_insert(0);
                                *counter += elapsed;
                            }
                        }
                        
                        current_window = window_title;
                        last_update = Instant::now();
                    }
                }
                None => {
                    println!("Could not determine the active window.");
                }
            }
        }
    });
}

#[cfg(target_os = "windows")]
fn get_active_window_title() -> Option<String> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.is_null() {
            return None;
        }

        let mut buffer: [u16; 512] = [0; 512];
        let len = GetWindowTextW(hwnd, buffer.as_mut_ptr(), buffer.len() as i32) as usize;
        
        if len == 0 {
            return None;
        }

        Some(String::from_utf16_lossy(&buffer[..len]))
    }
}

#[cfg(target_os = "macos")]
fn get_active_window_title() -> Option<String> {
    // AppleScript or macOS APIs
    unimplemented!("macOS support not implemented")
}

#[cfg(target_os = "linux")]
fn get_active_window_title() -> Option<String> {
    // xprop or X11/Xlib
    unimplemented!("Linux support not implemented")
}