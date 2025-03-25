import openai
import os
import subprocess
import json
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("Error: OPENAI_API_KEY not found in environment variables")
    sys.exit(1)

# Define utility functions
def run_command(command):
    """Run a shell command and return the output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode != 0:
            return f"Error: {result.stderr}"
        return result.stdout
    except Exception as e:
        return f"Error executing command: {str(e)}"

def read_file(file_path):
    """Read a file and return its contents"""
    try:
        with open(file_path, 'r') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def write_file(file_path, content):
    """Write content to a file"""
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        return f"Successfully wrote to {file_path}"
    except Exception as e:
        return f"Error writing to file: {str(e)}"

# Define functions for StatTact-specific tasks
def analyze_project_structure(project_path):
    """Analyze the StatTact project structure"""
    return run_command(f"find {project_path} -type f -name 'requirements.txt' -o -name 'render.yaml' | sort")

def check_render_yaml(project_path):
    """Check the render.yaml file"""
    render_path = os.path.join(project_path, "render.yaml")
    if os.path.exists(render_path):
        return read_file(render_path)
    else:
        return "render.yaml not found in the specified path"

def update_render_yaml(project_path, new_content):
    """Update the render.yaml file"""
    render_path = os.path.join(project_path, "render.yaml")
    return write_file(render_path, new_content)

def check_requirements_txt(filepath):
    """Check a requirements.txt file"""
    if os.path.exists(filepath):
        return read_file(filepath)
    else:
        return f"File not found: {filepath}"

def test_render_config(project_path):
    """Test if the render configuration is correct"""
    return run_command(f"cd {project_path} && render validate 2>&1 || echo 'Render CLI not installed or validation failed'")

def git_status(project_path):
    """Check git status of the project"""
    return run_command(f"cd {project_path} && git status")

def git_commit_and_push(project_path, message):
    """Commit and push changes to GitHub"""
    result = run_command(f"cd {project_path} && git add . && git commit -m '{message}' && git push")
    return result

# Define the available functions for the assistant
functions = [
    {
        "name": "analyze_project_structure",
        "description": "Analyze the StatTact project structure, finding requirements.txt and render.yaml files",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                }
            },
            "required": ["project_path"]
        }
    },
    {
        "name": "check_render_yaml",
        "description": "Check the render.yaml file to identify deployment configuration",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                }
            },
            "required": ["project_path"]
        }
    },
    {
        "name": "update_render_yaml",
        "description": "Update the render.yaml file with corrected configuration",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                },
                "new_content": {
                    "type": "string",
                    "description": "New content for the render.yaml file"
                }
            },
            "required": ["project_path", "new_content"]
        }
    },
    {
        "name": "check_requirements_txt",
        "description": "Check a specific requirements.txt file",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Path to the requirements.txt file"
                }
            },
            "required": ["filepath"]
        }
    },
    {
        "name": "test_render_config",
        "description": "Test if the render configuration is correct",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                }
            },
            "required": ["project_path"]
        }
    },
    {
        "name": "git_status",
        "description": "Check git status of the project",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                }
            },
            "required": ["project_path"]
        }
    },
    {
        "name": "git_commit_and_push",
        "description": "Commit and push changes to GitHub",
        "parameters": {
            "type": "object",
            "properties": {
                "project_path": {
                    "type": "string",
                    "description": "Path to the StatTact project"
                },
                "message": {
                    "type": "string",
                    "description": "Commit message"
                }
            },
            "required": ["project_path", "message"]
        }
    }
]

# Function execution mapping
function_map = {
    "analyze_project_structure": analyze_project_structure,
    "check_render_yaml": check_render_yaml,
    "update_render_yaml": update_render_yaml,
    "check_requirements_txt": check_requirements_txt,
    "test_render_config": test_render_config,
    "git_status": git_status,
    "git_commit_and_push": git_commit_and_push
}

# Main assistant loop
def main():
    print("🚀 StatTact AI Assistant")
    print("This assistant will help you solve your StatTact project tasks.\n")
    
    # Initialize conversation
    messages = [
        {"role": "system", "content": """You are an expert AI assistant for the StatTact project, a soccer tactics platform.
        The project consists of a Next.js frontend and a FastAPI backend.
        Help solve deployment issues, implement features, and provide clear guidance.
        Focus on solving one task at a time completely before moving to the next.
        Always check your work before making changes to the codebase."""}
    ]
    
    # Get project path
    project_path = input("Enter the path to your StatTact project (e.g., ~/StatTact): ")
    project_path = os.path.expanduser(project_path)
    
    print("\nWhat would you like help with today?")
    print("1. Fix Render deployment issue")
    print("2. Implement real API integration")  
    print("3. Set up authentication")
    print("4. Enhance UI components")
    print("5. Custom task")
    
    choice = input("\nEnter your choice (1-5): ")
    
    if choice == "1":
        task = "Fix the Render deployment issue. The error is: 'Could not open requirements file: [Errno 2] No such file or requirements.txt'. Find the correct path to requirements.txt and update render.yaml accordingly."
    elif choice == "2":
        task = "Implement real football API integration to replace the mock data currently being used."
    elif choice == "3":
        task = "Set up user authentication for the StatTact platform."
    elif choice == "4":
        task = "Enhance UI components, particularly the formation visualization with player drag-and-drop functionality."
    elif choice == "5":
        task = input("Describe your custom task: ")
    else:
        print("Invalid choice. Exiting.")
        return
    
    # Add task to conversation
    messages.append({"role": "user", "content": task})
    
    # Start the conversation loop
    while True:
        # Get response from OpenAI
        print("\n⏳ Thinking...")
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        response_message = response.choices[0].message
        
        # Add assistant's response to conversation history
        messages.append(response_message)
        
        # Check if the assistant wants to call a function
        if response_message.function_call:
            # Extract function details
            function_name = response_message.function_call.name
            function_args = json.loads(response_message.function_call.arguments)
            
            print(f"\n🔍 Executing: {function_name}")
            
            # Call the function
            if function_name in function_map:
                function_response = function_map[function_name](**function_args)
                
                # Add the function response to the conversation
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": function_response
                })
                
                # Print a summary of what was done
                print(f"✅ Executed {function_name}")
                if function_name == "update_render_yaml":
                    print("Updated render.yaml file")
                elif function_name == "git_commit_and_push":
                    print(f"Committed and pushed changes with message: {function_args.get('message', '')}")
                elif function_name in ["analyze_project_structure", "check_render_yaml", "check_requirements_txt"]:
                    print("Analyzed project files")
                
            else:
                print(f"❌ Error: Function {function_name} not implemented")
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": f"Error: Function {function_name} not implemented"
                })
        else:
            # Print the assistant's response
            print("\n🤖 Assistant:")
            print(response_message.content)
            
            # Ask for user input
            user_input = input("\nYour response (or type 'exit' to quit): ")
            
            if user_input.lower() == 'exit':
                break
            
            # Add user's response to conversation history
            messages.append({"role": "user", "content": user_input})

if __name__ == "__main__":
    main()
