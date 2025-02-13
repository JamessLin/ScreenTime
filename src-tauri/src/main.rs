// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tauri::{Manager, State};

mod tracking;
use crate::tracking::AppUsage;

struct AppState {
    tracking: Arc<Mutex<HashMap<String, AppUsage>>>,
}

//TODO Remove all debug logs
#[tauri::command]
fn get_tracking_data(state: State<'_, AppState>) -> Vec<AppUsage> {
    let state = state.tracking.lock().unwrap();
    println!("Current tracking data: {:?}", state);  
    let result: Vec<AppUsage> = state.values().cloned().collect();
    println!("Returning {} apps", result.len());  
    result
}

fn main() {
    let tracking_data = Arc::new(Mutex::new(HashMap::new()));
    println!("Starting application");  // Debug log
    
    tauri::Builder::default()
        .manage(AppState {
            tracking: tracking_data.clone(),
        })
        .invoke_handler(tauri::generate_handler![get_tracking_data])
        .setup(|app| {
            println!("Setting up tracking thread");  // Debug log
            tracking::start_tracking_thread(tracking_data);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}