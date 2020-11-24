import React, { createRef, FC } from 'react';
import { IToggleStyles, ICommandBarStyles, IIconProps, IBasePicker, ITag, TagPicker, CommandBarButton, IBasePickerSuggestionsProps, IInputProps, ValidationState } from '@fluentui/react';

export type Category = {
  id: number;
  text: string;
};

type Props = {
  onAddCategory: (categoryText: string) => Promise<Category>;
  onCategorySelected: (categoryId?: number) => void;
  onChange: (items: ITag[] | undefined) => void;
  onResolveSuggestions: (filter: string, selectedItems: ITag[] | undefined) => PromiseLike<ITag[]>;
};

const toggleStyles: Partial<IToggleStyles> = {
  text: { minWidth: '100%' }
};

const buttonStyles: Partial<ICommandBarStyles> = {
  root: {
    height: 30
  }
};

const addIcon: IIconProps = { iconName: 'Add' };
const tagPickerRef = createRef<IBasePicker<ITag>>();

const CategoryPicker: FC<Props> = ({ onAddCategory, onChange, onResolveSuggestions }) => {

  const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: "Existing categories",
    noResultsFoundText: 'No results found!',
    onRenderNoResultFound: () => {
      return (
        <CommandBarButton iconProps={addIcon} styles={buttonStyles} text="Add category" onClick={() => {
          tagPickerRef.current?.completeSuggestion(true);
        }} />
      );
    },
  };
  const inputProps: IInputProps = {
    style: { margin: 0 },
    placeholder: "Search categories"
  };

  const getTextFromItem = (item: ITag) => item.name;

  return (
    <TagPicker
      removeButtonAriaLabel="Remove"
      componentRef={tagPickerRef}
      itemLimit={1}
      styles={toggleStyles}
      onResolveSuggestions={onResolveSuggestions}
      getTextFromItem={getTextFromItem}
      pickerSuggestionsProps={pickerSuggestionsProps}
      inputProps={inputProps}
      onChange={onChange}
      onValidateInput={(input: string) => {
        return input ? ValidationState.valid : ValidationState.invalid;
      }}
      createGenericItem={(input: string) => {
        return { key: '', name: input } as ITag;
      }}
      onItemSelected={(item?: ITag | undefined) => {
        if (!item?.key) {
          return onAddCategory(item?.name || '')
            .then((category: Category) => ({ key: category.id, name: category.text }));
        }
        return item;
      }}
    />
  );
};

export default CategoryPicker;