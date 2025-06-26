import { Fragment, useState } from "react";
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";

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
    const [query, setQuery] = useState("");

    const filteredData =
        query === ""
            ? data
            : data.filter((data) =>
                  data.name
                      .toLocaleLowerCase("tr")
                      .replace(/\s+/g, "")
                      .includes(
                          query.toLocaleLowerCase("tr").replace(/\s+/g, ""),
                      ),
              ) || [];

    return (
        <Combobox immediate={false} onChange={onChange} value={value}>
            <div className={"relative inline-block w-full"}>
                <div className="w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none">
                    <ComboboxInput
                        className="w-full border-none text-sm text-zinc-700 outline-none pr-5"
                        displayValue={(item: ListBoxItem) =>
                            data.find(
                                (e) => e.id.toString() == item?.toString(),
                            )?.name || ""
                        }
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <BiChevronDown
                            className="w-5 h-5 text-zinc-700"
                            aria-hidden="true"
                        />
                    </ComboboxButton>
                </div>
                <ComboboxOptions
                    transition
                    className="absolute z-50 empty:invisible transition duration-200 ease-out mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-zinc/5 focus:outline-none sm:text-sm"
                >
                    {!data.length ||
                    (filteredData?.length === 0 && query !== "") ? (
                        <div className="block cursor-default select-none px-4 py-2 text-zinc-700">
                            Herhangi bir kayıt bulunamadı.
                        </div>
                    ) : (
                        <>
                            <ComboboxOption
                                key="null"
                                value={null}
                                className="block italic text-zinc-400 cursor-pointer select-none px-3.5 py-1"
                            >
                                Seçimi Temizle
                            </ComboboxOption>
                            {filteredData?.map((item: ListBoxItem) => (
                                <ComboboxOption
                                    key={item.id}
                                    value={item.id}
                                    className="block truncate cursor-pointer select-none px-3.5 py-1 data-[focus]:bg-sky-600 data-[focus]:text-white data-[selected]:bg-sky-600 data-[selected]:text-white data-[selected]:font-bold text-zinc-700"
                                >
                                    {item.name}
                                </ComboboxOption>
                            ))}
                        </>
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
}
