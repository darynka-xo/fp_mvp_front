// components/ui/dialog.js
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from './utils'

/**
 *
 * USAGE:
 *
 *   import {
 *     Dialog,
 *     DialogTrigger,
 *     DialogContent,
 *     DialogHeader,
 *     DialogTitle,
 *     DialogDescription,
 *     DialogFooter,
 *     DialogClose
 *   } from '../components/ui/dialog'
 *
 *   <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *     <DialogTrigger>Open</DialogTrigger>
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>Modal Title</DialogTitle>
 *         <DialogDescription>Some Description</DialogDescription>
 *       </DialogHeader>
 *       <DialogFooter>
 *         <DialogClose>Cancel</DialogClose>
 *       </DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 *
 */

// Root & Trigger
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

// Close button (convenience)
const DialogClose = DialogPrimitive.Close

// Portal
const DialogPortal = ({ className, children, ...props }) => (
    <DialogPrimitive.Portal {...props}>
        <div className={cn('fixed inset-0 z-50 flex items-start justify-center sm:items-center', className)}>
            {children}
        </div>
    </DialogPrimitive.Portal>
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

// Overlay
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all',
            // If you want the open/close animations, add data-state classes
            'data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut',
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// Content
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed z-50 grid w-full max-w-lg gap-4 rounded-lg bg-white p-6 shadow-lg',
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'duration-200 data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut',
                className
            )}
            {...props}
        >
            {children}
            {/* "X" close icon (top-right corner) */}
            <DialogPrimitive.Close
                className="absolute right-4 top-4 rounded-sm p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// Header, Footer, Title, Description
const DialogHeader = ({ className, ...props }) => (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-gray-500', className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose
}