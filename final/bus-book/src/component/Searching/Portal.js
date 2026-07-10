import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const Portal = ({ triggerRef, open, minWidth, children }) => {
	const [style, setStyle] = useState({});

	const reposition = () => {
		if (!triggerRef.current) return;
		const r = triggerRef.current.getBoundingClientRect();
		setStyle({
			position: "fixed",
			top: r.bottom + 8,
			left: r.left,
			minWidth: minWidth || r.width,
			zIndex: 9999,
		});
	};

	useEffect(() => {
		if (!open) return;
		reposition();
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	if (!open) return null;
	return ReactDOM.createPortal(<div style={style}>{children}</div>, document.body);
};

export default Portal;
