import toast from "react-hot-toast";

export function CopyToClipboard(text: string, message?: string) {
    navigator.clipboard.writeText(text);
    toast.success(message ?? "Panoya Kopyalandı!");
}

export function validateEmail(email: string) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    const emails = email.split(",").map((email) => email.trim());

    return emails.every((email) => reg.test(email));
}
