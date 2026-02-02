# Contributing to NirogCare

First off, thank you for considering contributing to NirogCare! 🎉 It's people like you that make NirogCare such a great tool for accessible healthcare.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by the [NirogCare Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [bhabens170@gmail.com](mailto:bhabens170@gmail.com).

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11, macOS Ventura]
 - Browser: [e.g. Chrome 120, Firefox 121]
 - Version: [e.g. 2.0.0]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most NirogCare users
- **List any alternatives** you've considered
- **Include mockups or examples** if applicable

### 🔧 Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/NirogCare.git
   cd NirogCare
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/bhabens170-cell/NirogCare.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your development credentials.

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📝 Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run linting**
   ```bash
   npm run lint
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test your changes** thoroughly

### PR Guidelines

1. **Title**: Use a clear, descriptive title
   - ✅ `Add blood pressure tracking feature`
   - ❌ `Updated stuff`

2. **Description**: Include:
   - What changes were made
   - Why the changes were made
   - Screenshots (if UI changes)
   - Related issue numbers

3. **Size**: Keep PRs small and focused
   - One feature/fix per PR
   - Break large changes into smaller PRs

4. **Documentation**: Update relevant documentation

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] The build passes locally
```

---

## 🎨 Style Guidelines

### Code Style

#### TypeScript/JavaScript

- Use **TypeScript** for all new files
- Follow the existing code style
- Use **meaningful variable names**
- Add **type annotations** for function parameters and return types
- Use **async/await** over promises where possible

```typescript
// ✅ Good
const fetchUserHealth = async (userId: string): Promise<HealthData> => {
  const response = await api.get(`/users/${userId}/health`);
  return response.data;
};

// ❌ Avoid
const getHealth = (id) => {
  return api.get('/users/' + id + '/health').then(r => r.data);
};
```

#### React Components

- Use **functional components** with hooks
- Use **named exports** for components
- Component files should be **PascalCase**
- Place component-specific styles with the component

```typescript
// ✅ Good
export const HealthCard: React.FC<HealthCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
};
```

#### CSS/Tailwind

- Use **Tailwind CSS** utility classes
- Follow the existing design system
- Use **CSS variables** for custom values
- Keep consistent spacing and sizing

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(health): add blood pressure tracking
fix(pharmacy): correct location search radius
docs(readme): update installation instructions
```

---

## 🌐 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: [bhabens170@gmail.com](mailto:bhabens170@gmail.com)

### Recognition

Contributors are recognized in:
- The project README
- Release notes
- Our contributors page

---

## 🏥 Health Data Guidelines

Since NirogCare handles health data, please follow these additional guidelines:

1. **Privacy First**: Never log or expose personal health information
2. **Secure Storage**: Use appropriate encryption for sensitive data
3. **HIPAA Awareness**: Be mindful of healthcare data regulations
4. **User Consent**: Always respect user privacy settings

---

## 📜 License

By contributing to NirogCare, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to NirogCare! Together, we're making healthcare more accessible. 💚

