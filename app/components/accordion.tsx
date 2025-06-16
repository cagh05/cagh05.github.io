export function Accordion ({list}: {list: string[]}) {
    return <>
        {list.map((item, index) => (
            <details key={index} className="group">
                <summary className="cursor-pointer list-none">
                    <span className="text-lg font-semibold">{item}</span>
                </summary>
                <div className="mt-2 pl-4">
                    <p className="text-gray-700">Content for {item} goes here.</p>
                </div>
            </details>
        ))}
    </>
}