import * as React from 'react';
import { 
    ShieldCheck, 
    Key,          
    Clock,        
    Settings,     
    FileText,     
    User,
    Mail,
    AlertTriangle,
    Trash
} from "lucide-react";

// Map des noms d'icônes
const LucideIconMap: { [key: string]: React.ElementType } = {
    ShieldCheckIcon: ShieldCheck,
    KeyIcon: Key,
    ClockIcon: Clock,
    SettingsIcon: Settings, 
    FileTextIcon: FileText, 
    UserIcon: User,
    MailIcon: Mail,
    AlertTriangleIcon: AlertTriangle,
    TrashIcon: Trash
};

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, className, ...props }) => {
    const Component = LucideIconMap[name];
    
    if (!Component) {
        console.warn(`Icon component not found for name: ${name}`);
        return null;
    }

    return <Component className={className} {...props} />;
};

export default CustomIcon;