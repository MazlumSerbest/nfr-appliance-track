import toast from "react-hot-toast";

export function CopyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Panoya Kopyalandı!")
}