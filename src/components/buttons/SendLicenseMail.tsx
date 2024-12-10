import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { BiMailSend } from "react-icons/bi";
import { DateFormat } from "@/utils/date";
import { validateEmail } from "@/utils/functions";
import { sendMail } from "@/lib/sendmail";

type Props = {
    current: Current;
    licenseType: string;
    appliance: string | null;
    serialNo: string;
    startDate: string;
    expiryDate: string;
};

export default function SendLicenseMail({
    current,
    licenseType,
    appliance,
    serialNo,
    startDate,
    expiryDate,
}: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const emailValid = validateEmail(current?.email ?? "");

    async function onSend() {
        const mail = await sendMail({
            to: current?.email as string,
            cc: "",
            subject: "Lisans Süre Dolumu",
            html: `
                <p>Merhaba ${current?.name},</p>
                <p>Lisans süreniz ${DateFormat(
                    startDate,
                )} tarihinde başladı ve ${DateFormat(
                expiryDate,
            )} tarihinde sona erecek.</p>
                <p>Lütfen lisansınızı süresiz hale getirmek için bizimle iletişime geçin.</p>
                <p>İyi çalışmalar dileriz.</p>
            `,
        });
        console.log(mail);
        
        if (mail) {
            onOpenChange();
        }
    }

    return (
        <>
            <Tooltip content="Lisans Süre Dolum Maili Gönder">
                <Button color="secondary" isIconOnly onPress={onOpen}>
                    <BiMailSend />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Lisans Süre Dolum Maili Gönder
                            </ModalHeader>
                            <ModalBody className="text-sm">
                                <p className="font-medium">
                                    {current?.name + " "}
                                    <span className="font-normal text-zinc-500">
                                        adlı cariye, bitiş tarihi
                                    </span>
                                    {" " + DateFormat(expiryDate) + " "}
                                    <span className="font-normal text-zinc-500">
                                        olan lisans için mail gönderilecek.
                                        Devam etmek istediğinizden emin misiniz?
                                    </span>
                                </p>

                                <p className="font-medium mt-4">
                                    Mail adresi:
                                    <span className="text-zinc-500 font-normal">
                                        {` ${current?.email}`}
                                    </span>
                                </p>
                                {emailValid ? null : (
                                    <span className="text-red-500 text-xs">
                                        Cari mail adresi geçerli formatta değil.
                                    </span>
                                )}

                                <p className="font-medium">
                                    Lisans:
                                    <span className="text-zinc-500 font-normal">{` ${licenseType}`}</span>
                                </p>
                                <p className="font-medium">
                                    Cihaz:
                                    <span className="text-zinc-500 font-normal">{` ${appliance}`}</span>
                                </p>
                                <p className="font-medium">
                                    Seri No:
                                    <span className="text-zinc-500 font-normal">{` ${serialNo}`}</span>
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="bordered" onPress={onClose}>
                                    Kapat
                                </Button>
                                <Button
                                    isDisabled={!emailValid}
                                    color="primary"
                                    className="text-white bg-green-600"
                                    onPress={emailValid ? onSend : undefined}
                                >
                                    Gönder
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
