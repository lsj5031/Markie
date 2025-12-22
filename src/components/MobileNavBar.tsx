import React from "react";
import * as Icons from "./Icons";

interface MobileNavBarProps {
    activeTab: "editor" | "preview";
    setActiveTab: (tab: "editor" | "preview") => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
    activeTab,
    setActiveTab,
}) => {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-16 border-t z-50 flex items-center justify-around px-2 lg:hidden"
            style={{
                backgroundColor: "var(--studio-surface)",
                borderColor: "var(--studio-border)",
            }}
        >
            <button
                onClick={() => setActiveTab("editor")}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === "editor"
                    ? "text-[var(--studio-accent)]"
                    : "text-[var(--studio-text)] opacity-50"
                    }`}
            >
                <Icons.Edit />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    Editor
                </span>
            </button>

            <button
                onClick={() => setActiveTab("preview")}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === "preview"
                    ? "text-[var(--studio-accent)]"
                    : "text-[var(--studio-text)] opacity-50"
                    }`}
            >
                <Icons.Eye />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    Preview
                </span>
            </button>
        </div>
    );
};
