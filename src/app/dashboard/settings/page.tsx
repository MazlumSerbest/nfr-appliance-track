"use client"
import GeneralTab from "./tabs/General";
import ProductsTab from "./tabs/Products";
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
                <Tab key="models" title="Ürünler" className="w-full">
                    {ProductsTab()}
                </Tab>
            </Tabs>
        </div>
    );
}