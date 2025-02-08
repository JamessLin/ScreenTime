use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::Mutex,
    time::{Instant, Duration},
};
use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppTimeInfo {
    title: String,
    time: u64,
}

pub struct ScreenTimeState {
    tracking: Mutex<HashMap<String, u64>>,
    current_window: Mutex<String>,
    last_update: Mutex<Instant>,
}

impl ScreenTimeState {
    pub fn new() -> Self {
        ScreenTimeState {
            tracking: Mutex::new(HashMap::new()),
            current_window: Mutex::new(String::new()),
            last_update: Mutex::new(Instant::now()),
        }
    }
}

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

#[tauri::command]
pub fn get_app_times(state: tauri::State<ScreenTimeState>) -> Vec<AppTimeInfo> {
    let tracking = state.tracking.lock().unwrap();
    tracking
        .iter()
        .map(|(title, time)| AppTimeInfo {
            title: title.clone(),
            time: *time,
        })
        .collect()
}

pub fn update_screen_time(state: &ScreenTimeState) {
    if let Some(window_title) = get_active_window_title() {
        let mut current_window = state.current_window.lock().unwrap();
        let mut last_update = state.last_update.lock().unwrap();
        let mut tracking = state.tracking.lock().unwrap();

        if window_title != *current_window {
            let elapsed = last_update.elapsed().as_secs();
            if !current_window.is_empty() {
                let counter = tracking.entry(current_window.clone()).or_insert(0);
                *counter += elapsed;
            }
            *current_window = window_title;
            *last_update = Instant::now();
        }
    }
}