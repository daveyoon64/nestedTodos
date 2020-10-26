# Nested Todos

## Requirements
- Build a simple todo app that support the nesting of todo comments

## The Basic Idea
```html
<!doctype html>
<html lang="en" data-framework="jquery">
	<head></head>
	<body>
        <ul>
            <li>Yeehaw Sauce</li>
            <ul>
                <li>MOAR YEEHAW</li>
                    <ul>
                        <li>OH YEEEEEEHAW GIT ER DONE</li>
                            <ul>
                                <li>OH DANGGGGG</li>
                                <ul>
                                    <li>COME GIT COMMIT WOOO</li>
                                </ul>
                            </ul>
                                
                    </ul>
            </ul>
        </ul>
    </body>
</html>
```
- In general, it seems that inserting an unordered list into a list element will create the nested effect.

## Implementation Plan
1. Rewrite tempString so a new todo be made programatically DONE
2. Decide on how we're going to mark a todo as a child/has a parent
3. Update create (if necessary) to reflect the todo's parent
4. Back in render, make sure that if a todo is a child, you append it to it's parent (uuid?)
5. There's will be some work when deleting a child or a parent. I'll cross that bridge when I get there.

## Useful links and references
1. https://workflowy.com/demo/embed/
