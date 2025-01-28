import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { BiMailSend } from "react-icons/bi";
import { DateFormat } from "@/utils/date";
import { validateEmail } from "@/utils/functions";
import { sendMail } from "@/lib/sendmail";
import toast from "react-hot-toast";

type Props = {
    current: Current;
    licenseType: string;
    appliance: string | null;
    serialNo: string;
    expiryDate: string;
};

export default function SendLicenseMail({
    current,
    licenseType,
    appliance,
    serialNo,
    expiryDate,
}: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const emailValid = validateEmail(current?.email ?? "");

    async function onSend() {
        const html = `<div style="display: flex; flex-direction: column; color: white; font-family: Arial, sans-serif, 'Open Sans';"><div style="display: flex; justify-content: center; margin-bottom: 3rem; margin-top: 2rem;"><img style="width: 30%"  src="https://nfrbilisim.com/wp-content/uploads/2022/04/nfr-logo.png" /></div><div style="display: flex; justify-content: center;"><div style="background-color: rgba(14, 165, 233, 0.9); padding: 2rem; border-radius: 0.5rem; margin-bottom: 3rem; max-width: 768px;"><p>Merhabalar,</p><p>${
            current?.name
        } adına kayıtlı, seri numarası <strong>${serialNo}</strong> olan${
            appliance ? <strong>{appliance}</strong> : ""
        } cihazınızın <strong>"${licenseType}"</strong> lisansı <strong>${DateFormat(
            expiryDate,
        ).replaceAll(
            ".",
            "/",
        )}</strong> tarihinde sona erecektir.</p><p>Lisansınız yenilenmesi için satış ekibimizle iletişime geçiniz.</p><p>İyi Çalışmalar Dileriz </br><strong>NFR Bilişim ve Güvenlik Teknolojileri A.Ş.</strong></p></div></div></div>`;

        const mail: any = await sendMail({
            to: current?.email as string,
            cc: "",
            subject: "Lisans Süre Dolumu",
            html: html,
        });
        console.log(mail);

        if (!mail.ok) {
            toast.error(mail.message);
        } else {
            toast.success("Mail başarıyla gönderildi.");
            onOpenChange();
        }
    }

    return (
        <>
            <Tooltip content="Lisans Süre Dolum Maili Gönder">
                <Button
                    color="primary"
                    className="bg-indigo-500 rounded-md"
                    radius="sm"
                    isIconOnly
                    onPress={onOpen}
                >
                    <BiMailSend className="size-5" />
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
