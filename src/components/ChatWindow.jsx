import React, { useRef, useEffect } from 'react'
import Message from './Message'


export default function ChatWindow({ messages }) {
const endRef = useRef(null)


useEffect(() => {
endRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])


return (
<div className="flex-1 overflow-auto p-4 max-h-[60vh]">
<div className="space-y-3">
{messages.map(msg => (
<Message key={msg.id} msg={msg} />
))}
<div ref={endRef} />
</div>
</div>
)
}