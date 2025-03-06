// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


mod app_usage;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tauri::{Manager, State};
use app_usage::{get_app_usage, start_tracking};

fn main() {
    tauri::Builder::default()
    .setup(|app| {
        start_tracking();
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_app_usage])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}