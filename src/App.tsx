import {useState} from "react";
import reactLogo from "./assets/react.svg";
import {invoke, InvokeOptions, InvokeArgs} from "@tauri-apps/api/core";
import {exists, readDir, BaseDirectory} from '@tauri-apps/plugin-fs';
import "./App.css";


const NOT_TAURI = 'can\'t access property "invoke", window.__TAURI_INTERNALS__ is undefined'
async function wrapper(cmd: string, args?: InvokeArgs, options?: InvokeOptions): Promise<string> {
    try {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        return await invoke(cmd, args, options);
    } catch (e) {
        if (e instanceof TypeError && e.message === NOT_TAURI) {
            return await (await fetch(`https://kkyubr.com/api/${cmd}`, {
                method: "POST",
                body: JSON.stringify(args)
            })).text()
        } else {
            throw e
        }
    }
}


function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        setGreetMsg(await wrapper("greet", {name}))
        // setGreetMsg(await invoke("greet", {name}))
    }

    async function greet2() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("my_custom_command", {invoke_message: name}));


        // Check if the `$APPDATA/avatar.png` file exists
        const response = await exists('avatar.png', {baseDir: BaseDirectory.AppData});

        console.log(BaseDirectory)
        console.log(await exists('main.tsx', {baseDir: BaseDirectory.AppData}))

        const dir = 'users';
        const entries = await readDir('users', {dir: BaseDirectory.App});
        await processEntriesRecursive(dir, entries);

        async function processEntriesRecursive(parent, entries) {
            for (const entry of entries) {
                console.log(`Entry: ${entry.name}`);
                if (entry.isDirectory) {
                    const dir = parent + entry.name;
                    await processEntriesRecursive(dir, await readDir(dir, {dir: BaseDirectory.App}));
                }
            }
        }

    }

    return (
        <div className="container">
            <h1>Welcome to Tauri!</h1>

            <div className="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo"/>
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo"/>
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>

            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="이름을 입력하시오"
                />
                <button type="submit">Greet</button>
            </form>
            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet2();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="이름을 입력하시오"
                />
                <button type="submit">Greet</button>
            </form>

            <p>{greetMsg}</p>
        </div>
    );
}

export default App;
