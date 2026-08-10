import { Label } from 'semantic-ui-react';

const SubjectTags = (props) => {
  const { content } = props;
  const tags = content?.subjects;

  return tags?.length > 0 ? (
    <div className="tags">
      Filed under:{' '}
      {tags.map((tag) => (
        <Label size="small" key={tag}>
          {tag}
        </Label>
      ))}
    </div>
  ) : null;
};

export default SubjectTags;
