const AboutPage = () => {
    const temp_arr = new Array(100).fill(null)

    return <div className="w-full flex max-h-[100vh]">
        <div className={"sticky left-0 flex flex-col max-h-[100vh]"}>
            <div className={"sticky top-0 h-10"}>
                sidebar header
            </div>
            <div className={"flex max-h-[calc(100vh-40px)  overflow-y-scroll"}>
                <ol className={"w-[5rem] bg-blue-300 overflow-y-auto overflow-x-hidden"}>
                    {temp_arr.map((_, i) => <li className={"text-2xl text-center my-1 py-4"} key={i}>{i}</li>)}
                </ol>
                <ol className={"w-[5rem] bg-green-400 overflow-y-auto overflow-x-hidden"}>
                    {temp_arr.map((_, i) => <li key={i}>{i}</li>)}
                </ol>
            </div>
        </div>
        <div className={"max-h-[100vh]"}>
            <div className={"sticky top-0 w-full h-10"}>header</div>
            <div className={"h-[calc(100vh-40px)] w-[calc(100vw-10rem)] bg-amber-300"}>content</div>
        </div>
    </div>
}

export default AboutPage;