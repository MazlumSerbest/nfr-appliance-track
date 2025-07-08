import React, {
    useState,
    useRef,
    useEffect,
    ChangeEvent,
    FocusEvent,
} from "react";

type PriceInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    value?: number | null;
    onChange?: (value: number | null) => void;
};

const PriceInput: React.FC<PriceInputProps> = ({
    value,
    onChange,
    ...props
}) => {
    // input alanında kullanıcının gördüğü ve üzerinde değişiklik yaptığı değeri tutar.
    // Bu değer, formatlanmamış veya kısmen formatlanmış ham string olabilir.
    const [internalDisplayValue, setInternalDisplayValue] =
        useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Bu useEffect, bileşen ilk yüklendiğinde veya 'value' prop'u dışarıdan değiştiğinde tetiklenir.
    // Amaç: Dışarıdan gelen 'value' prop'unu input alanında gösterilecek formatlı stringe dönüştürmek.
    useEffect(() => {
        // Sadece 'value' gerçekten bir sayıysa veya 'value' değiştiyse bu formatlamayı yap.
        // Eğer input zaten odaklanmışsa (kullanıcı yazıyorsa), anlık formatlama yapma
        // ki kullanıcının yazma akışı bozulmasın.
        if (inputRef.current && document.activeElement === inputRef.current) {
            // Eğer input zaten odaklanmışsa, dışarıdan gelen 'value' prop'u olsa bile
            // kullanıcının girdiği ham değeri koru.
            return;
        }

        if (value !== undefined && value !== null) {
            // Sayıyı Türk Lirası formatına göre biçimlendir
            // (binlik ayraçlar nokta, ondalık ayraç virgül, 2 ondalık basamak)
            const formattedValue = new Intl.NumberFormat("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
            setInternalDisplayValue(formattedValue);
        } else {
            // value null veya undefined ise inputu boşalt
            setInternalDisplayValue("");
        }
    }, [value]); // Sadece 'value' prop'u değiştiğinde bu efekti yeniden çalıştır

    // Kullanıcı input alanına her karakter yazdığında tetiklenir.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Sadece rakamları (0-9), virgülü (,) ve noktayı (.) koruruz.
        // Diğer tüm karakterleri temizleriz.
        let cleanedValue = rawValue.replace(/[^0-9,.]/g, "");

        // Birden fazla virgül varsa sadece ilkini korur, diğerlerini kaldırır.
        // Örn: "100,,25" -> "100,25"
        const commaIndex = cleanedValue.indexOf(",");
        if (commaIndex !== -1) {
            const parts = cleanedValue.split(",");
            cleanedValue = parts[0] + "," + parts.slice(1).join("");
        }

        // Virgülden sonraki kısmın en fazla iki basamakla sınırlı olmasını sağlar.
        // Örn: "123,456" -> "123,45"
        const partsAfterComma = cleanedValue.split(",");
        if (partsAfterComma.length > 1) {
            partsAfterComma[1] = partsAfterComma[1].substring(0, 2);
            cleanedValue = partsAfterComma.join(",");
        }

        // Input alanında gösterilecek değeri güncelle. Bu, kullanıcının gördüğü değerdir.
        setInternalDisplayValue(cleanedValue);

        // onChange fonksiyonuna gönderilecek sayısal değeri hesapla.
        // Türk Lirası formatından JS sayı formatına çevir: binlik ayraçları (.) kaldır, ondalık ayraç (,) yerine nokta (.) koy.
        const numericString = cleanedValue.replace(/\./g, "").replace(",", ".");
        const numericValue = parseFloat(numericString);

        // Eğer onChange prop'u varsa, değeri number olarak geri gönder.
        // isNaN kontrolü, kullanıcı sadece "," veya ".." gibi şeyler girerse null göndermeyi sağlar.
        if (onChange) {
            onChange(isNaN(numericValue) ? null : numericValue);
        }
    };

    // Kullanıcı input odağını kaybettiğinde (input dışına tıkladığında veya tab ile geçtiğinde) tetiklenir.
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        // Mevcut input değerini al ve sayısal değere çevir.
        const numericString = internalDisplayValue
            .replace(/\./g, "")
            .replace(",", ".");
        const currentNumericValue = parseFloat(numericString);

        // Eğer değer geçersiz bir sayıysa veya input tamamen boşsa, 0.00 olarak ayarla.
        if (isNaN(currentNumericValue) || internalDisplayValue === "") {
            const formattedZero = new Intl.NumberFormat("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(0);
            setInternalDisplayValue(formattedZero); // Input'ta 0,00 göster
            if (onChange) {
                onChange(0); // Arka plana 0 değerini gönder
            }
            return; // Fonksiyonu sonlandır
        }

        // Geçerli bir sayı varsa, bu sayıyı istenen Türkçe formatında göster.
        const formattedValue = new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(currentNumericValue);
        setInternalDisplayValue(formattedValue);

        // Eğer sayısal değer dışarıya gönderilmesi gereken 'value' prop'undan farklıysa,
        // onChange'i çağırarak üst bileşeni güncelle.
        if (onChange && currentNumericValue !== value) {
            onChange(currentNumericValue);
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={internalDisplayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            inputMode="decimal"
            {...props}
        />
    );
};

export default PriceInput;
