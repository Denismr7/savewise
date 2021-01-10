import React, { useContext, useEffect, useState } from 'react';
import { Category } from '../../services/objects/categories';
import { CategoryService } from "../../services";
import { LoginContext } from '../../common/context/LoginContext';

export function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const {login} = useContext(LoginContext);
  
  useEffect(() => {
    const id: number = login.login?.id as number;
    CategoryService.getCategories(id).then(rsp => {
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
  }, [login]);

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