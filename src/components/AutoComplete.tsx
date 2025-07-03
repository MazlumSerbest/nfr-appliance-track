import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { cn } from "@heroui/react";

type Props = {
    data: ListBoxItem[];
    value?: any;
    className?: string;
    onChange: (value: any) => any;
};

export default function AutoComplete({
    data,
    value,
    className,
    onChange,
}: Props) {
    return (
        <Autocomplete
            variant="bordered"
            onSelectionChange={(e) => onChange(Number(e) || null)}
            selectedKey={value?.toString()}
            radius="sm"
            classNames={{
                popoverContent: "rounded",
            }}
            inputProps={{
                classNames: {
                    inputWrapper: cn(
                        "w-full rounded-md border-1 px-3.5 py-2 text-zinc-700 shadow-sm placeholder:text-zinc-400 data-[focus=true]:border-0 data-[focus=true]:ring-2 data-[focus=true]:ring-inset data-[focus=true]:ring-sky-500 sm:text-sm sm:leading-6 outline-none",
                        "hover:border-1 hover:ring-zinc-300 outline-none border-none",
                        data.find((e) => e.id.toString() == value?.toString())
                            ?.blacklisted
                            ? "ring-2 ring-inset ring-red-500 text-red-500"
                            : "ring-1 ring-inset ring-zinc-300",
                    ),
                },
            }}
            listboxProps={{
                emptyContent: "Herhangi bir kayıt bulunamadı.",
            }}
        >
            {data.map((item) => (
                <AutocompleteItem
                    key={item.id}
                    classNames={{
                        base: cn(item.blacklisted ? "text-red-500" : ""),
                    }}
                >
                    {item.name + (item.blacklisted ? " (Kara Listede)" : "")}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
}
