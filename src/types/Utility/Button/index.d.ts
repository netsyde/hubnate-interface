import React, { useState, useEffect, useRef, MouseEventHandler } from "react";
export interface IButton {
    name: string,
    link?: string,
    type: ButtonType,
    padding?: string,
    onClick?: any//MouseEventHandler<HTMLAnchorElement>,
    className?: string
}

export type ButtonType = 'transparent' | 'default' | 'disabled';