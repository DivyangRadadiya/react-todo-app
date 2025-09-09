## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-todo-app

2. Install dependencies:
    ```bash
    npm install


# If you clone this project and run `npm install`
# and get a dependency conflict (ERESOLVE error),
# please use one of the following commands instead:
#
#   npm install --legacy-peer-deps
#       → Recommended, installs ignoring peer dependency conflicts
#
#   OR
#
#   npm install --force
#       → Forces install but may use mismatched versions
#
# ===============================

3. Start the development server:
    ```bash
    npm run dev
    or
    yarn dev
    or
    pnpm dev
    or
    bun dev

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

- npm run build


## Usage

### Adding Tasks
1. Click "Add New Task" button
2. Fill in the title (required) and description (optional)
3. Select a folder and add tags if desired
4. Click "Add Task"

### Managing Folders
1. Use the "+" button next to "Folders" in the sidebar
2. Enter folder name and select a color
3. Delete folders using the "X" button (tasks move to General folder)

### Organizing Tasks
- **Drag & Drop**: Drag tasks by the grip handle to reorder
- **Folders**: Click folder names to filter tasks
- **Tags**: Click tags in sidebar to filter by tag
- **Search**: Use the search bar to find tasks by content

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
