import React, { useEffect, useState } from 'react';
import { Category } from '../../services/objects/categories';
import { CategoryService } from "../../services";

export function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoryService.getCategories(1).then(rsp => {
      if (rsp.status.success) {
        setCategories(rsp.categories);
        setLoading(false);
      } else {
        console.log(`Error: ${rsp.status.errorMessage}`);
      }
    }).catch(e => {
      console.log(`ERROR: ${e}`);
    })
    return () => {
      setCategories([]);
    }
  }, []);

  const showCategories = (categories: Category[]) => {
    return categories.map(category => {
      return <p className={`category${category.id}`} key={category.id}>{ category.name }</p>
    })
  }

  return (
    <div>
      { loading ? "Loading" : showCategories(categories) }
    </div>
  );
}