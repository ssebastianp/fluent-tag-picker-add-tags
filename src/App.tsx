import React, { Component } from 'react';
import { initializeIcons, ITag } from '@fluentui/react';
import CategoryPicker, { Category } from './components/CategoryPicker';
import './App.css';

initializeIcons('https://static2.sharepointonline.com/files/fabric/assets/icons/', { disableWarnings: true });

type State = {
  categories: Category[];
  selectedCategoryId?: number;
};

const App = class extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      categories: [
        {
          id: 1,
          text: 'red'
        },
        {
          id: 2,
          text: 'green'
        },
        {
          id: 3,
          text: 'blue'
        }
      ]
    };
  }

  onAddCategory = async (text: string) => {
    /* you can call the server endpoint here */
    const response = await Promise.resolve({
      id: this.state.categories.length,
      text
    });

    this.setState(prevState => ({
      ...prevState,
      categories: [
        ...prevState.categories,
        response
      ]
    }));

    return response;
  };

  onCategorySelected = (id?: number) => {
    this.setState(prevState => ({
      ...prevState,
      selectedCategoryId: id
    }));
  };

  onResolveSuggestions = async (
    filter: string,
    selectedItems: ITag[] | undefined
  ): Promise<ITag[]> => {
    if (filter) {
      return this.state.categories
        .filter((category: Category) => category.text.toLowerCase().includes(filter.toLowerCase()))
        .map((category: Category): ITag => {
          return {
            name: category.text,
            key: category.id
          };
        });
    }
    return [];
  };

  onChange = (items?: ITag[] | undefined) => {
    if (items && items[0]) {
      this.onCategorySelected(Number(items[0].key));
    } else {
      this.onCategorySelected();
    }
  };

  render() {
    return (
      <div className="AppMainDiv" >
        <CategoryPicker
          onAddCategory={this.onAddCategory}
          onCategorySelected={this.onCategorySelected}
          onResolveSuggestions={this.onResolveSuggestions}
          onChange={this.onChange}
        />
      </div >
    );

  }
};

export default App;
