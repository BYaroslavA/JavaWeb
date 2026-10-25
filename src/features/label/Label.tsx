import LabelTypes from './types/LabelTypes';
import './ui/Label.css';

export default function Label({title, type, borderWidth}: 
        {title: string, type?:LabelTypes, borderWidth?: number}
    ) {
    const fillColor = type == LabelTypes.Violet ? "#8985C5"
                    : type == LabelTypes.Blue ? "#2681CE"
                    : type == LabelTypes.Black ? "#1d1d1d"
                    : type == LabelTypes.White ? "#fefefe"
                    : "#00A397";
    
    return <div className="site-label">
        <svg width="100%" height="100%" viewBox="0 0 111 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100.734 1L110 12.1445V22.8623L100.785 34H10.2803L1 22.8789V12.1504L10.2715 1H100.734Z" 
                fill={fillColor}
                stroke="white" 
                strokeWidth={borderWidth ?? "0"}></path>
        </svg>
        <p style={{color: type == LabelTypes.Black ? "#d1d1d1" : "#1d1d1d" }}>{title}</p>
    </div>;
}