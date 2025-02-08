// Dont remove
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod screen_time;

use screen_time::{ScreenTimeState, get_app_times, update_screen_time};
use std::time::Duration;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .manage(ScreenTimeState::new())
        .invoke_handler(tauri::generate_handler![get_app_times])
        .setup(|app| {
            let app_handle = app.handle();
            let state = app.state::<ScreenTimeState>();
            
            std::thread::spawn(move || {
                loop {
                    update_screen_time(&state);
                    std::thread::sleep(Duration::from_secs(1));
              
                    let _ = app_handle.emit_all("screen-time-update", 
                        get_app_times(state.clone()));
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}