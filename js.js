window.addEventListener("load", ()=> {
    console.log("pog")

    document.querySelectorAll("#make-wavy").forEach((header) => {
        const text = header.textContent
        header.textContent = ""
        for (let at = 0; at < text.length; at++) {
            let letter = text.charAt(at)
            let node = document.createElement("h2")
            node.textContent = letter
            node.setAttribute("id", "wavy")
            node.style.animationDelay = at/5 + "s"
            
            header.appendChild(node)

        }

    })

})
