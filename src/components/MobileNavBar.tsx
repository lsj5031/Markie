import React from "react";
import * as Icons from "./Icons";

interface MobileNavBarProps {
    activeTab: "editor" | "preview";
    setActiveTab: (tab: "editor" | "preview") => void;
    // Pagination props
    showPagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPreviousPage?: () => void;
    onNextPage?: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
    activeTab,
    setActiveTab,
    showPagination = false,
    currentPage = 0,
    totalPages = 1,
    onPreviousPage,
    onNextPage,
}) => {
    const showPageControls = showPagination && activeTab === "preview" && totalPages > 1;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 border-t z-50 lg:hidden"
            style={{
                backgroundColor: "var(--studio-surface)",
                borderColor: "var(--studio-border)",
            }}
        >
            {/* Page indicator - Floating above nav */}
            {showPageControls && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+16px)] flex items-center gap-1.5 p-1.5 rounded-full shadow-xl border backdrop-blur-md"
                    style={{
                        backgroundColor: "var(--studio-surface)",
                        borderColor: "var(--studio-border)",
                        zIndex: 60,
                    }}
                >
                    <button
                        onClick={onPreviousPage}
                        disabled={currentPage === 0}
                        className="flex items-center justify-center transition-all active:scale-95 rounded-full hover:bg-black/5"
                        style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: currentPage === 0
                                ? "transparent"
                                : "var(--studio-accent)",
                            opacity: currentPage === 0 ? 0.3 : 1,
                            color: currentPage === 0 ? "var(--studio-text)" : "white",
                        }}
                        aria-label="Previous Page"
                    >
                        <svg
                            style={{ width: "18px", height: "18px" }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div
                        className="flex items-center gap-2 px-3"
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "var(--studio-text)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {currentPage + 1}
                        </span>
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "var(--studio-text)",
                                opacity: 0.3,
                            }}
                        >
                            /
                        </span>
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "var(--studio-text)",
                                opacity: 0.6,
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {totalPages}
                        </span>
                    </div>

                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center justify-center transition-all active:scale-95 rounded-full hover:bg-black/5"
                        style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: currentPage === totalPages - 1
                                ? "transparent"
                                : "var(--studio-accent)",
                            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                            color: currentPage === totalPages - 1 ? "var(--studio-text)" : "white",
                        }}
                        aria-label="Next Page"
                    >
                        <svg
                            style={{ width: "18px", height: "18px" }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Main navigation tabs */}
            <div className="h-16 flex items-center justify-around px-2">
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
        </div>
    );
};
