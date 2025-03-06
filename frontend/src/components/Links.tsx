import Link from 'next/link';

interface LinkProps {
    href: string;
    title: string;
    className: string;
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Links: React.FC<LinkProps> = ({ href, title, className, onClick }) => {
    return (
        <Link href={href} className={className} onClick={onClick}>
            {title}
        </Link>
    );
};

export default Links;
