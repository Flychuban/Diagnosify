export const MsgHider: React.FC<{ msg: string, maxTextLength?: number }> = ({msg,maxTextLength}) => {
    return <div>
        {msg.slice(0,maxTextLength ?? 7)}...
    </div>
}