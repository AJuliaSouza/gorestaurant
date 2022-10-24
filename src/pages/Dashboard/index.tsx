import { useEffect, useState } from "react"
import { Food } from "../../components/Food";
import { Header } from "../../components/Header";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import api from "../../services/api"
import { FoodsContainer } from "./styles";

export interface MenuFoods {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<MenuFoods[]>([]);
  const [editingFood, setEditingFood] = useState<MenuFoods>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<MenuFoods[]>(`foods`);

      const data = response.data;
      setFoods(data);
    }

    loadFoods();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  };

  async function handleAddFood(data: MenuFoods) {
    try {
      const response = await api.post<MenuFoods>(`/foods`, {
        ...data,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  function handleEditFood(food: MenuFoods) {
    setEditModalOpen(true);
    setEditingFood(food);
  };

  async function handleUpdateFood(food: MenuFoods) {
    if (!editingFood?.id) {
      console.log('Não foi possível editar a comida!')
      return;
    }
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`,
        { ...editingFood, ...food });

      const foodsUpdated = foods.map(food => food.id !== foodUpdated.data.id ? food : foodUpdated.data)
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header
        openModal={toggleModal}
      />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}

      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
}