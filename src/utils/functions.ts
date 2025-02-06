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

export function formatPhoneNumber(phoneNumberString: string) {
    // Sadece rakamları al
    let digits = phoneNumberString.replace(/\D/g, "");

    // Başındaki "0"ı kaldır
    if (digits.startsWith("0")) {
        digits = digits.substring(1);
    }

    // Maksimum 10 karakter al
    digits = digits.slice(0, 10);

    // Format: XXX XXX XX XX
    let formatted = digits;
    if (digits.length > 6) {
        formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
            6,
            8,
        )} ${digits.slice(8, 10)}`;
    } else if (digits.length > 3) {
        formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)}`;
    }

    return formatted;
}
