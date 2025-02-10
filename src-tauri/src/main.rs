// Dont remove
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, State};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

mod tracking;

#[derive(serde::Serialize)]
struct TrackingData {
    app_name: String,
    duration: u64,
}

struct AppState {
    tracking: Arc<Mutex<HashMap<String, u64>>>,
}

#[tauri::command]
fn get_tracking_data(state: State<'_, AppState>) -> Vec<TrackingData> {
    let state = state.tracking.lock().unwrap();
    state.iter()
        .map(|(app_name, duration)| TrackingData {
            app_name: app_name.clone(),
            duration: *duration,
        })
        .collect()
}



fn main() {
    let tracking_data = Arc::new(Mutex::new(HashMap::new()));
    
    tauri::Builder::default()
        .manage(AppState {
            tracking: tracking_data.clone(),
        })
        .invoke_handler(tauri::generate_handler![get_tracking_data])
        .setup(|app| {
            tracking::start_tracking_thread(tracking_data);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}