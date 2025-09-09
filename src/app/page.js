import { TodoProvider } from "@/context/TodoContext";
import TodoApp from "@/components/TodoApp";
import "../index.css";

export default function Home() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50">
        <TodoApp />
      </div>
    </TodoProvider>
  );
}
