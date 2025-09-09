import { Droppable } from "react-beautiful-dnd";
import TodoItem from "./TodoItem";

function TodoList({ todos }) {
  return (
    <Droppable
      droppableId="todos"
      isCombineEnabled={false}
      isDropDisabled={false}
      ignoreContainerClipping={false}
    >
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`space-y-4 transition-colors duration-200 ${
            snapshot.isDraggingOver ? "bg-blue-50" : ""
          }`}
        >
          {todos.map((todo, index) => (
            <TodoItem key={todo.id} todo={todo} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TodoList;
