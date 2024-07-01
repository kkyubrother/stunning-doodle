mod common;

use std::env;
use std::net::ToSocketAddrs;
use std::fs;
use std::io;
use std::path::Path;
use winreg::enums::*;
use winreg::RegKey;

use serde::Deserialize;
use tauri_plugin_http::reqwest;

fn get_hostname() -> String {
    let hostname = match (env::var("HOSTNAME"), env::var("COMPUTERNAME")) {
        (Ok(host), _) => host,
        (_, Ok(comp)) => comp,
        _ => {
            let addrs = ("localhost", 0).to_socket_addrs().unwrap().collect::<Vec<_>>();
            if !addrs.is_empty() {
                addrs[0].ip().to_string()
            } else {
                "unknown".to_string()
            }
        }
    };
    hostname
}


#[derive(Debug, Deserialize)]
struct Todo {
    userId: u32,
    id: u32,
    title: String,
    completed: bool,
}

#[tauri::command]
fn get_json_from_backend() -> Result<String, String> {
    let file_path = "path/to/your/file.json";
    fs::read_to_string(file_path).map_err(|err| err.to_string())
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    eprintln!("{:?}", env::current_dir().unwrap());

    if let Ok(n0) = env::var("SEARCH_AUTOMATION__CLIENT_NAME") {
        eprintln!("{:?}", n0);
    }
    else {
        let hostname = get_hostname();
        println!("{:?}", hostname);
    }


    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn greet2(name: &str) -> String {

    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(rename_all = "snake_case")]
fn my_custom_command(invoke_message: String, window: tauri::Window) -> u32 {
    println!("Window: {}", window.label());
    println!(
        "I was invoked from JS, with this message: {}",
        invoke_message
    );

    let response: Todo = reqwest::blocking::get("https://jsonplaceholder.typicode.com/todos/1")
        .expect("에러에러")
        .json()
        .expect("에러");

    println!("Response: {:?}", response);
    response.userId
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, greet2, my_custom_command])
        // .invoke_handler(tauri::generate_handler![my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
