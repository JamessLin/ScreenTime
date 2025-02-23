// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


mod app_usage;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tauri::{Manager, State};
use app_usage::{get_app_usage, start_tracking};

fn main() {
    // let tracking_data = Arc::new(Mutex::new(HashMap::new()));
    // println!("Starting application");  // Debug log
    
    // tauri::Builder::default()
    //     .manage(AppState {
    //         tracking: tracking_data.clone(),
    //     })
    //     .invoke_handler(tauri::generate_handler![get_tracking_data])
    //     .setup(|app| {
    //         println!("Setting up tracking thread");  // Debug log
    //         tracking::start_tracking_thread(tracking_data);
    //         Ok(())
    //     })
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
    tauri::Builder::default()
    .setup(|app| {
        start_tracking();
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_app_usage])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}