import React from "react";

const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "About", href: "#" },
];

const NavBar = () => (
    <nav
        style={{
            width: "1000px",
            height: "60%",
            backdropFilter: "blur(12px)",
            background: "rgba(30, 30, 30, 0.7)",
            padding: "1rem 2rem",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            fontFamily: "'Segoe UI', sans-serif",
            transition: "all 0.3s ease",
        }}
    >
        <div
            style={{
                fontWeight: 800,
                fontSize: "1.8rem",
                color: "#ffffff",
                letterSpacing: "0.5px",
            }}
        >
            WebProducer
        </div>
        <ul
            style={{
                display: "flex",
                gap: "1.5rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
            }}
        >
            {navItems.map((item) => (
                <li key={item.name}>
                    <a
                        href={item.href}
                        style={{
                            position: "relative",
                            color: "#f0f0f0",
                            textDecoration: "none",
                            fontWeight: 500,
                            fontSize: "1rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "8px",
                            transition: "all 0.25s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        {item.name}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
);

export default NavBar;
