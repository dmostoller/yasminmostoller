import parse, { HTMLReactParserOptions } from 'html-react-parser';

interface FormattedContentProps {
  content: string;
}

const FormattedContent = ({ content }: FormattedContentProps) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && domNode.attribs) {
        // Add target and rel attributes to external links
        return {
          ...domNode,
          attribs: {
            ...domNode.attribs,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-teal-600 hover:text-teal-700 transition-colors',
          },
        };
      }
    },
  };

  return (
    <div className="text-[var(--text-secondary)] prose prose-teal max-w-none prose-a:no-underline">
      {parse(content || '', options)}
    </div>
  );
};

export default FormattedContent;
