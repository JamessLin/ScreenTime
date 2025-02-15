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

struct ActiveWindow {
    id: u32,
    title: String,
}

/// Windows implementation to get the active window.
/// This function retrieves the window handle, its process ID, and attempts to read its title.
/// If the title is empty or cannot be retrieved, it logs the issue and returns "Unknown".
#[cfg(target_os = "windows")]
fn get_active_window() -> Option<ActiveWindow> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.is_null() {
            eprintln!("GetForegroundWindow returned null.");
            return None;
        }

        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id);

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

        Some(ActiveWindow { id: process_id, title })
    }
}

/// Fallback for non-Windows platforms.
/// Currently not implemented; logs an informative message.
#[cfg(not(target_os = "windows"))]
fn get_active_window() -> Option<ActiveWindow> {
    eprintln!("Active window detection is not implemented for this OS. Please contribute support for your platform.");
    None
}

/// Internal structure for tracking usage data per unique window.
struct UsageData {
    seconds: u64,
    /// time marker used to calculate elapsed durations accurately.
    last_instant: Instant,
    /// The most recent local time when the window was active.
    last_used: DateTime<Local>,
    /// The window title; this value may update if the window’s title changes.
    title: String,
}

/// Global usage map keyed by the unique identifier (process ID).
/// RwLock is used to allow concurrent reads while ensuring safe writes.
static APP_USAGE: Lazy<RwLock<HashMap<u32, UsageData>>> = Lazy::new(|| {
    RwLock::new(HashMap::new())
});

#[derive(Debug, Clone, Serialize)]
pub struct AppUsage {
    /// A unique ID generated from the process ID.
    pub id: String,
    /// The window title.
    pub name: String,
    /// Formatted active time as "HH:MM".
    pub time: String,
    /// Total active time in minutes.
    pub time_in_minutes: u64,
    /// Change percentage (reserved for future logic).
    pub change: i64,
    /// Assigned icon filename.
    pub icon: String,
    /// Last active time as a formatted string.
    pub last_used: String,
    /// A simple category based on the window title.
    pub category: String,
}

/// Starts tracking active window usage.
/// Uses Tauri's async runtime to ensure a Tokio reactor is running.
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
                            // The active window changed. Calculate elapsed time for the previous window.
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
                                        title: curr.title.clone(),
                                    });
                            }
                            println!(
                                "Switched to: '{}' at {}",
                                new_window.title,
                                Local::now().format("%Y-%m-%d %H:%M:%S")
                            );
                            // Switch to the new active window.
                            current_window = Some(new_window);
                            last_update_instant = now;
                        } else {
                            // The same window remains active; accumulate its active time.
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
                                        title: new_window.title.clone(),
                                    });
                            }
                            last_update_instant = now;
                        }
                    }
                    None => {
                        // No current window is tracked; initialize tracking.
                        // Print out the current time and active window title for the first time.
                        println!(
                            "Started tracking: '{}' at {}",
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

/// Categorizes the app based on its title.
/// (For now, this is a simple heuristic and can be expanded.)
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

/// Determines an icon based on the window title using a simple mapping.
fn get_icon(name: &str) -> String {
    let lower = name.to_lowercase();
    // TODO: Fix hard coding 
    let icon_map = [
        ("chrome", "chrome-icon.png"),
        ("firefox", "firefox-icon.png"),
        ("vscode", "vscode-icon.png"),
        ("code", "vscode-icon.png"),
    ];
    for (keyword, icon) in &icon_map {
        if lower.contains(keyword) {
            return icon.to_string();
        }
    }
    "default-icon.png".to_string()
}

fn format_time(seconds: u64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    format!("{:02}:{:02}", hours, minutes)
}

/// Tauri command that returns the current usage data for display on the frontend.
#[tauri::command]
pub fn get_app_usage() -> Vec<AppUsage> {
    let usage_map = APP_USAGE.read().unwrap();
    let mut result = Vec::new();

    for (&id, data) in usage_map.iter() {
        let minutes = data.seconds / 60;
        result.push(AppUsage {
            id: format!("{:x}", md5::compute(id.to_le_bytes())),
            name: data.title.clone(),
            time: format_time(data.seconds),
            time_in_minutes: minutes,
            change: 0, // Future logic for change tracking can be implemented here.
            icon: get_icon(&data.title),
            last_used: data.last_used.format("%Y-%m-%d %H:%M:%S").to_string(),
            category: categorize_app(&data.title),
        });
    }

    result
}
