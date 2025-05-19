import { useState } from "react";

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

import { BiSolidEnvelope } from "react-icons/bi";
import { DateFormat } from "@/utils/date";
import { validateEmail } from "@/utils/functions";
import { sendMail } from "@/lib/sendmail";
import toast from "react-hot-toast";
import { logo } from "@/lib/base64";

type Props = {
    dealer?: Current;
    customer: Current;
    email: string;
    licenseId: number;
    licenseType: string;
    appliance: string | null;
    serialNo: string;
    expiryDate: string;
    mutate: () => void;
};

export default function SendLicenseMail({
    dealer,
    customer,
    email,
    licenseId,
    licenseType,
    appliance,
    serialNo,
    expiryDate,
    mutate,
}: Props) {
    const [submitting, setSubmitting] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const emailValid = validateEmail(email ?? "");

    async function onSend() {
        setSubmitting(true);

        const html = dealer
            ? `<div style="display: flex; flex-direction: column; background-color: white; color: white; font-family: Arial, sans-serif, 'Open Sans'; line-height: 1.5;">
            <div style="display: flex; justify-content: center; margin-bottom: 3rem; margin-top: 2rem;"><img style="width: 30%" src="${logo}" /></div><div style="display: flex; justify-content: center;"><div style="background-color: rgba(14, 165, 233, 0.9); padding: 2rem; border-radius: 0.5rem; margin-bottom: 3rem; max-width: 768px;"><p>Merhabalar,</p><p>${
                  customer?.name
              } adlı müşteriye ait, seri numarası <strong>${serialNo}</strong> olan<strong>${
                  appliance ? " " + appliance : ""
              }</strong> cihazınızın <strong>"${licenseType}"</strong> lisansı <strong>${DateFormat(
                  expiryDate,
              ).replaceAll(
                  ".",
                  "/",
              )}</strong> tarihinde sona erecektir.</p><p>Lisansınız yenilenmesi için bizimle iletişime geçebilirsiniz.</p><p>İyi çalışmalar,</br><strong>NFR Bilişim ve Güvenlik Teknolojileri A.Ş.</strong></br><a href="mailto:satis@nfrbilisim.com">satis@nfrbilisim.com </a> / <a href="tel:+90 232 449 06 37">+90 232 449 06 37</a></p></div></div></div>`
            : `<div style="display: flex; flex-direction: column; background-color: white; color: white; font-family: Arial, sans-serif, 'Open Sans'; line-height: 1.5;"><div style="display: flex; justify-content: center; margin-bottom: 3rem; margin-top: 2rem;"><img style="width: 30%" src="${logo}" /></div><div style="display: flex; justify-content: center;"><div style="background-color: rgba(14, 165, 233, 0.9); padding: 2rem; border-radius: 0.5rem; margin-bottom: 3rem; max-width: 768px;"><p>Merhabalar,</p><p>${
                  customer?.name
              } adına kayıtlı, seri numarası <strong>${serialNo}</strong> olan<strong>${
                  appliance ? " " + appliance : ""
              }</strong> cihazınızın <strong>"${licenseType}"</strong> lisansı <strong>${DateFormat(
                  expiryDate,
              ).replaceAll(
                  ".",
                  "/",
              )}</strong> tarihinde sona erecektir.</p><p>Lisansınız yenilenmesi için bizimle iletişime geçebilirsiniz.</p><p>İyi çalışmalar,</br><strong>NFR Bilişim ve Güvenlik Teknolojileri A.Ş.</strong></br><a href="mailto:satis@nfrbilisim.com">satis@nfrbilisim.com </a> / <a href="tel:+90 232 449 06 37">+90 232 449 06 37</a></p></div></div></div>`;

        await sendMail({
            to: email,
            cc: "satis@nfrbilisim.com",
            subject: "Lisans Süre Dolumu",
            html: html,
        }).then((res) => {
            if (res && !res.ok) {
                toast.error(res?.message);
            } else {
                toast.success("Mail başarıyla gönderildi.");
                fetch(`/api/license/${licenseId}/mailSended`, {
                    method: "POST",
                    body: JSON.stringify({
                        licenseId,
                        to: email,
                        subject: "Lisans Süre Dolumu",
                        content: html,
                    }),
                }).then(() => {
                    mutate();
                    onClose();
                });
            }

            setSubmitting(false);
        });
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
                    <BiSolidEnvelope className="size-5" />
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
                                {!dealer && customer && (
                                    <p className="font-medium">
                                        {customer?.name + " "}
                                        <span className="font-normal text-zinc-500">
                                            adlı müşteriye, bitiş tarihi
                                        </span>
                                        {" " + DateFormat(expiryDate) + " "}
                                        <span className="font-normal text-zinc-500">
                                            olan lisans için mail gönderilecek.
                                            Devam etmek istediğinizden emin
                                            misiniz?
                                        </span>
                                    </p>
                                )}

                                {dealer && (
                                    <p className="font-medium">
                                        {dealer?.name + " "}
                                        <span className="font-normal text-zinc-500">
                                            adlı bayiye, bitiş tarihi
                                        </span>
                                        {" " + DateFormat(expiryDate) + " "}
                                        <span className="font-normal text-zinc-500">
                                            olan lisans için mail gönderilecek.
                                            Devam etmek istediğinizden emin
                                            misiniz?
                                        </span>
                                    </p>
                                )}

                                {dealer && (
                                    <p className="font-medium mt-4">
                                        Müşteri:
                                        <span className="text-zinc-500 font-normal">
                                            {` ${customer?.name}`}
                                        </span>
                                    </p>
                                )}

                                <p className="font-medium">
                                    Gönderileceği mail adresi:
                                    <span className="text-zinc-500 font-normal">
                                        {` ${email}`}
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
                                    color="primary"
                                    className="text-white bg-green-600"
                                    isDisabled={!emailValid}
                                    isLoading={submitting}
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
