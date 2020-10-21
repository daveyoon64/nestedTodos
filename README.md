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

## Useful links and references
1. https://workflowy.com/demo/embed/
