"use client"
import GeneralTab from "./tabs/General";
import AppliancesTab from "./tabs/Appliances";
import UsersTab from "./tabs/Users";
import { Tabs, Tab } from "@nextui-org/tabs";

export default function SettingsPage() {

    return (
        <div className="flex flex-col w-full items-center mt-4">
            <Tabs
                size="lg"
                color="default"
                key="management"
                aria-label="Management Tabs"
            >
                <Tab key="general" title="Genel" className="w-full">
                    {GeneralTab()}
                </Tab>
                <Tab key="appliances" title="Cihazlar" className="w-full">
                    {AppliancesTab()}
                </Tab>
                <Tab key="users" title="Kullanıcılar" className="w-full">
                    {UsersTab()}
                </Tab>
            </Tabs>
        </div>
    );
}