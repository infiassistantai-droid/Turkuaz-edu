export default function ProtectedRoute({ authenticated, required = true, children }) {
  // The application uses in-place tabs instead of separate routes, so guarding
  // the shared shell protects Dashboard, Exams Hub, Vocabulary, and every tab.
  if (required && !authenticated) return null
  return children
}
