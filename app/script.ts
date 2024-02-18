import { Types } from "ably/promises";
import * as Ably from "ably/promises";


(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;
    const chat_id = localStorage.getItem("chat_id");
    const showuser = document.getElementById("show-online-users-btn");
    form.addEventListener("submit", (e:SubmitEvent) => {
        e.preventDefault();

        const message = {
            chat_id: chat_id,
            text: input.value
        };

        if (message.text.trim() != "" && message.chat_id.trim() != "")
        {
            channel.publish({name: "chat-message", data: message.chat_id + " : " + message.text});
            input.value = "";
            input.focus();
        }
        else
        {
            alert("Message is empty");
        }

    });
    localStorage.clear();
    let spanValues = [];
    await channel.subscribe((msg: Types.Message) => {
        const messageElement = document.createElement("span");
        messageElement.classList.add("msg");
        messageElement.innerHTML = msg.data;

        const author = msg.connectionId === ably.connection.id ? "me" : "other";
        messageElement.setAttribute("id", author);

        messages.appendChild(messageElement);

        const spanElements = document.querySelectorAll("span.msg");
        spanValues = [];
        spanElements.forEach((span) => {
            spanValues.push(span.textContent);
        });
        });
        let values = [];
        showuser.addEventListener("click", () => {
            let str: string = "";
            spanValues.forEach((item) => {
                let sub: string = item;
                values.push(sub.substring(0, sub.indexOf(":")));
            });
            let uniquevalues = [...new Set(values)];
            uniquevalues.forEach((item) => {
                str = str + item + ",";
            });
            if (str.trim() == "") 
            {
                alert("No one online");
            }
            else
            {
            alert("Online users: " + str.substring(0, str.length-1));
            }
        });
})();

export { };
